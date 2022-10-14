const pad = require('pad');

class TableBuilder {
    constructor(columns, options) {
        this._columns = [TableBuilder._createIndexColumn()];
        if (columns) {
            this._columns.push(...columns);
        }
        this._items = [];
    }
 
    addRow(...rows) {
        rows.forEach((row) => this._items.push(row));
    }
 
    build() {
        // Header
        let result = `\`${this._buildRow(this._createHeader())}\n`;
        result += pad('', this._totalWidth(), '―');

        this._items.forEach((row, index) => {
            result += `\n${this._buildRow(row, index + 1)}`;
        });
        return `${result}\``;
    }
 
    _buildRow(data, index) {
        const keys = Object.keys(data).filter((key) => this._columns.find((col) => col.field === key));
        keys.sort((keyA, keyB) => {
            const colA = this._columns.find((col) => col.field === keyA);
            const colB = this._columns.find((col) => col.field === keyB);
            return colA.index - colB.index;
        });

        let result = index ? pad(String(index), TableBuilder._createIndexColumn().width) : '';
        keys.forEach((key) => {
            const column = this._columns.find((col) => col.field === key);
            let content = data[key];
            if (column.format && index) {
                content = column.format(data[key]);
            }
            result += pad(String(content), column.width);
        });
        return result;
    }
 
    _createHeader() {
        const header = {};
        this._columns.forEach((col) => {
            header[col.field] = col.label;
        });
        return header;
    }
 
    _totalWidth() {
        let width = 0;
        this._columns.forEach((col) => (width += col.width));
        return width;
    }
 
    _compareValues(a, b) {
        if (this._options.sortDirection === 'desc') {
            [a, b] = [b, a];
        }
        if (typeof a === 'string') {
            return a.localeCompare(b);
        } else if (typeof a === 'number') {
            return a - b;
        } else if (a instanceof Date) {
            return a.getTime() - b.getTime();
        }
    }
 
    static _createIndexColumn() {
        return {
            index: 0,
            label: '#',
            width: 5,
            field: '#',
        };
    }
}
 
module.exports = TableBuilder;