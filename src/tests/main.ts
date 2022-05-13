import { ConditionSchema } from '..';
import '../lib/style.css';

const context = {
  a: '1',
  b: '2'
};

const dom = document.createElement('div');

document.body.appendChild(dom);

const conditon = new ConditionSchema({
  context,
  dom
});

console.log(conditon);
