const parser = require('@babel/parser');

const config = [
  {
    key: 'systemEvaluation',
    text: '架构评估',
    children: [
      { key: '/system-evaluation/sizing-evaluation', text: '体量维度' },
      { key: '/system-evaluation/coupling-evaluation', text: '耦合维度' },
      { key: '/system-evaluation/cohesion-evaluation', text: '内聚度维度' },
      { key: '/system-evaluation/Redundancy', text: '冗余度维度' },
    ],
  },
];

const testData = JSON.stringify(config);

const ast = parser.parse(testData);
console.log('ast: ', ast);
