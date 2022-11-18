#! /usr/bin/env node
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import chalk from 'chalk';
import prompts from 'prompts'
import readline from 'readline'
import ora from 'ora'
import download from 'download-git-repo'
import fs from 'fs'

/* 配置命令参数 */
const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'version', alias: 'v', type: Boolean },
  { name: 'arg1', type: String },
  { name: 'arg2', type: Number },
];
const options = commandLineArgs(optionDefinitions);

/* 输出列表  帮助内容 */
const helpSections = [
  {
    header: 'create-hdy',
    content: '一个快速生成组件库搭建环境的脚手架',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'version',
        typeLabel: '{underline boolean}',
        description: '版本号',
      },
      {
        name: 'arg1',
        typeLabel: '{underline string}',
        description: '参数1',
      },
      {
        name: 'arg2',
        typeLabel: '{underline number}',
        description: '参数2',
      },
    ],
  },
];

if (options.help) console.log(chalk.yellow(commandLineUsage(helpSections)))

/* 命令行交互 */
// readline:node 自带原生交互
/* const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question('你是谁?', function (answer) {
  console.log(`我是${answer}`);
  //添加close事件，不然不会结束
  rl.close();
}); */

// prompts
/* const promptsOptions = [
  {
    type: 'text',
    name: 'user',
    message: '用户'
  },
  {
    type: 'password',
    name: 'password',
    message: '密码'
  },
  {
    type: 'select',//单选
    name: 'gender',
    message: '性别',
    choices: [
      { title: '男', value: 0 },
      { title: '女', value: 1 }
    ]
  },
  {
    type: 'multiselect', //多选
    name: 'study',
    message: '选择学习框架',
    choices: [
      { title: 'Vue', value: 0 },
      { title: 'React', value: 1 },
      { title: 'Angular', value: 2 }
    ]
  },
]

const getInputInfo = async () => {
  const res = await prompts(promptsOptions)
  console.log(res)
}
getInputInfo() */


/* 拉取模板 */

const gitClone = (remote, name, option) => {
  const loadingOra = ora('正在下载模板...').start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, err => {
      if (err) {
        loadingOra.fail();
        console.log("err", chalk.red(err));
        reject(err);
        return;
      };
      loadingOra.succeed(chalk.green('success'));
      console.log(`Done. Now run:\r\n`);
      console.log(chalk.green(`cd ${name}`));
      console.log(chalk.blue("npm install"));
      console.log("npm run dev\r\n");
      resolve();
    });
  });
};

const promptsOptions = [
  {
    type: 'text',//单选
    name: 'name',
    message: 'project-name',
    validate(val) {
      if (!val) return '模板名称不能为空！';
      if (fs.existsSync(val)) return '项目名已存在'
      if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) return '模板名称包含非法字符，请重新输入';
      return true;
    }
  },

  {
    type: 'select',//单选
    name: 'template',
    message: 'select a framework',
    choices: [
      { title: 'micro-app-test', value: 1 },
      { title: 'gmp', value: 2 }
    ]
  }
]
const remoteList = {
  1: "git@github.com:hdy6323989/micro-app-test.git",
  2: 'xxx'
}
const branch = 'main'


const getInputInfo = async () => {

  const res = await prompts(promptsOptions)
  if (!res.name || !res.template) return
  gitClone(`direct:${remoteList[res.template]}#${branch}`, res.name, { clone: true })
}
getInputInfo()