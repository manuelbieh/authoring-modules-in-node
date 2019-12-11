import add from './add';
import divide from './divide';
import multiply from './multiply';
import subtract from './subtract';

export default (op: 'add' | 'subtract' | 'multiply' | 'divide') => {
    if (op === 'add') {
        return add;
    }
    if (op === 'subtract') {
        return subtract;
    }
    if (op === 'multiply') {
        return multiply;
    }
    if (op === 'divide') {
        return divide;
    }

    throw new Error('Unknown operation');
};
