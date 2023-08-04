import { Guid } from "guid-typescript";
import { Status } from "./enum.model";

export class Todo{
    constructor(
        public id: Guid,
        public name: string,
        public priority: number,
        public status: string,
    ){  }
    }