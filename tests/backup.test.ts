import { describe, expect, it } from "vitest";
import { backupFileName, readBackup } from "@/lib/backup";
import { samplePlan } from "@/lib/sample";

const file = (data: unknown) => new Blob([typeof data === "string" ? data : JSON.stringify(data)]);
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]).toString("base64");

describe("saved file", () => {
  it("names the file after the person and the date", () => {
    expect(backupFileName(samplePlan(), new Date("2026-09-30T10:00:00Z"))).toBe("waqt-pe-ammi-2026-09-30.waqtpe");
    const unnamed = { ...samplePlan(), person: { ...samplePlan().person, name: "امی" } };
    expect(backupFileName(unnamed, new Date("2026-09-30T10:00:00Z"))).toBe("waqt-pe-2026-09-30.waqtpe");
  });

  it("reads the plan and the photos it refers to", async () => {
    const plan = samplePlan();
    plan.medicines[0].photoId = "box1";
    plan.contacts[0].photoId = "face1";
    const result = await readBackup(
      file({
        format: "waqtpe",
        version: 1,
        plan,
        photos: {
          box1: { type: "image/jpeg", data: jpeg },
          face1: { type: "image/jpeg", data: jpeg },
          stray: { type: "image/jpeg", data: jpeg }, // not in the plan: ignored
        },
      }),
    );
    if (typeof result === "string") throw new Error(result);
    expect(result.plan).toEqual(plan);
    expect([...result.photos.keys()].sort()).toEqual(["box1", "face1"]);
    expect(new Uint8Array(await result.photos.get("box1")!.arrayBuffer())).toEqual(new Uint8Array(Buffer.from(jpeg, "base64")));
  });

  it("skips photos that aren't images", async () => {
    const plan = samplePlan();
    plan.medicines[0].photoId = "box1";
    const result = await readBackup(file({ format: "waqtpe", version: 1, plan, photos: { box1: { type: "text/html", data: jpeg } } }));
    if (typeof result === "string") throw new Error(result);
    expect(result.photos.size).toBe(0);
    expect(result.plan.medicines[0].photoId).toBe("box1"); // shown as missing, the plan still imports
  });

  it("rejects files that aren't Waqt Pe saved files", async () => {
    expect(await readBackup(file("hello"))).toBe("notSaveFile");
    expect(await readBackup(file({ format: "other", version: 1 }))).toBe("notSaveFile");
    expect(await readBackup(file({ format: "waqtpe", version: 99, plan: {} }))).toBe("notSaveFile");
  });

  it("sanitises the plan inside", async () => {
    const result = await readBackup(file({ format: "waqtpe", version: 1, plan: { person: { name: "Ammi" }, giver: { type: "robot" } } }));
    if (typeof result === "string") throw new Error(result);
    expect(result.plan.person.name).toBe("Ammi");
    expect(result.plan.giver.type).toBe("family");
  });
});
