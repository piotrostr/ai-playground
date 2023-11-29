import { write } from "bun";

export const dumpJSON = (obj: any, destination = "dump.json") => {
  console.log("Writing ", destination);
  write(destination, JSON.stringify(obj, null, 4));
};
