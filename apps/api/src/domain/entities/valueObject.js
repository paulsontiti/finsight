export class ValueObject {
    props;
    constructor(props) {
        this.props = Object.freeze(props);
    }
    equals(vo) {
        if (!vo)
            return false;
        return JSON.stringify(this.props) === JSON.stringify(vo.props);
    }
}
//# sourceMappingURL=valueObject.js.map