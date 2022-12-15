const keywords = [
    'local', 'function', 'do', 'while', 'for', 'in', 'repeat',
    'if', 'then', 'end', 'not', 'nil', 'false', 'true', 'and', 'or'
];

const globals = [
    '_G', '_R', 'CLIENT', 'SERVER',
    'ipairs', 'pairs', 'include',
    'Color', 'Vector', 'Angle',
    'math', 'print', 'hook'
];

const patterns = [
    { type: 'whitespace', regex: /^ +/is },
    { type: 'string', regex: /^".*?"/is },
    { type: 'variable', regex: /^\w+/is },
    { type: 'newline', regex: /^\n+/is },
    { type: 'parenthesis', regex: /^[\(\)]/is },
    { type: 'comment', regex: /^--[^\n]*/is },
    { type: 'punctuation', regex: /^[.:,]/is }
];

class Token {
    /**
     * @param {string} type The type of token
     * @param {string} value The value of the token
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

/**
 * @param {string} text
 */
function parse(text) {
    let tokens = [];
    let position = 0;

    while (position < text.length) {
        let type = null;
        let match = '';

        for (let pattern of patterns) {
            let result = pattern.regex.exec(text.substring(position));
            if (result === null || result.length === 0) continue;

            if (result[0].length > match.length) {
                match = result[0];
                type = pattern.type;
            }
        }

        if (type === null) {
            tokens.push(new Token('text', text.substring(position)));
            break;
        };

        tokens.push(new Token(type, match));
        position += match.length;
    }

    return tokens;
}

function parseCodeBlocks() {
    let blocks = document.getElementsByClassName('code');

    for (let block of blocks) {
        let code = block.innerHTML;
        code = code.trim().replace(/^\s+|\s+$/g, '');

        let tokens = parse(code);
        block.innerHTML = '';

        for (let token of tokens) {
            let element = document.createElement('span');
            element.innerHTML = (token.value == '\n') ? '<br>' : token.value;

            if (keywords.indexOf(token.value) != -1) {
                element.style.color = '#C678DD';
            } else if (globals.indexOf(token.value) != -1) {
                element.style.color = '#E5C07B'
            } else if (token.type === 'string') {
                element.style.color = '#98C379'
            } else if (token.type === 'variable') {
                element.style.color = '#61AFEF'
            } else if (token.type === 'comment') {
                element.style.color = '#7F848E';
            }

            block.appendChild(element);
        }

        let button = document.createElement('a');
        button.className = 'button';

        button.addEventListener('click', () => {
            navigator.clipboard.writeText(code);
        });
        
        block.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', parseCodeBlocks);