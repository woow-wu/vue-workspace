/*
 * fast add new module script
 */
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const reslove = file => path.resolve(__dirname, '../src', file)
// symbol const
const RouterSymbol = Symbol('router'),
      ViewsSymbol = Symbol('views')
// root path
const rootPath = {
  [RouterSymbol]: reslove('router/modules'),
  [ViewsSymbol]: reslove('views')
}
//loggs
const errorLog = error => console.log(chalk.red(`${error}`))
const defaultLog = log => console.log(chalk.green(`${log}`))
// module name
let moduleName = new String()
let fileType = new String()
//const string
const vueFile = module => (`<template>

</template>

<script>
export default {
  name: '${module}',
  data () {
    return {

    }
  },
  methods: {

  },
  created() {
    
  }
}
</script>

<style lang="less">

</style>
`)
// route file
const routerFile = module => (`// write your comment here...
export default [
  {
    path: '/${module}',
    name: '',
    redirect: '/${module}',
    component: () => import('@/views/frame/Frame'),
    children: [
      {
        path: '',
        fullPath: '',
        name: '',
        component: () => import('@/views/${module}/index')
      }
    ]
  }
]
`)
/**
 * generate file
 * @param {*} filePath 
 * @param {*} content 
 * @param {*} dirPath 
 */
const generateFile = async (filePath, content, dirPath = '') =>{
  try {
    // create file if file not exit
    if (dirPath !== '' && ! await fs.existsSync(dirPath)) {
      await fs.mkdirSync(dirPath)
      defaultLog(`created ${dirPath}`)
    }
    if (! await fs.existsSync(filePath)) {
      // create file
      await fs.openSync(filePath, 'w')
      defaultLog(`created ${filePath}`)
    }
    await fs.writeFileSync(filePath, content, 'utf8')
  } catch (error) {
    errorLog(error)
  }
}
// module-method map
const generates = new Map([
  ['view', async (module) => {
    // module file
    const filePath = path.join(rootPath[ViewsSymbol], module)
    const vuePath = path.join(filePath, '/index.vue')
    await generateFile(vuePath, vueFile(module), filePath)
  }],
  // router is not need new folder
  ['router',async (module) => {
    const routerPath = path.join(rootPath[RouterSymbol], `/${module}.js`)
    await generateFile(routerPath, routerFile(module))
  }]
])
defaultLog(`请输入模块名称(英文)：`)
// files
const files = ['view', 'router']
// 和命令行进行交互 获取的创建的模块名称
process.stdin.on('data', (chunk) => {
  try {
    if (!moduleName) {
      moduleName = chunk
    } else {
      chunk = chunk.slice(0,-2) // delete /n
      defaultLog(`new module name is ${chunk}`)
      files.forEach(async (el, index) => {
        // 执行创建语句
        await generates.get(`${el}`).call(null, chunk.toString())
        if (index === files.length-1) {
          process.stdin.emit('end')
        }
      })
    }
  } catch (error) {
    errorLog(error)
  }
})
process.stdin.on('end', () => {
  defaultLog('create module success')
})
