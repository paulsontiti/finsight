import { randomUUID } from "crypto";
export class Entity {
    id;
    //public readonly props: T;
    constructor(id) {
        this.id = id ?? randomUUID();
        //this.props = props;
    }
}
//# sourceMappingURL=entity.js.map