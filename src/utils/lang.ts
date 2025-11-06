const iniList = [
  '.editorconfig',
  '.gitattributes',
  '.gitmodules',
  '.yarnrc',
  '.npmrc',
]
const jsonList = [
  '.prettierrc',
  '.eslintrc',
  '.babelrc',
  '.stylelintrc',
  'import map',
]

const shellList = [
  '.zshrc',
  '.bashrc',
  '.gitignore',
  '.prettierignore',
  '.eslintignore',
  '.stylelintignore',
  '.dockerignore',
  '.bash_profile',
  '.bash_logout',

  'dockerfile',
  'makefile',
  'docker-compose',
]

const markdownList = [
  'README',
  'CHANGELOG',
  'CONTRIBUTORS',
  'CODE_OF_CONDUCT',
  'SECURITY',
  'PULL_REQUEST_TEMPLATE',
  'ISSUE_TEMPLATE',
].map(name => name.toLowerCase())

export default function getLanguageByFileName(fileName: string) {
  const name = fileName.toLowerCase()

  switch (true) {
    case iniList.includes(name):
      return 'ini'
    case jsonList.includes(name):
      return 'json'
    case shellList.includes(name):
      return 'shell'
    case markdownList.includes(name):
      return 'markdown'
  }

  const ext = name.split('.').pop() || ''

  switch (true) {
    case ['js', 'jsx', 'cjs', 'mjs'].includes(ext):
      return 'javascript'
    case ['ts', 'tsx', 'cts', 'mts'].includes(ext):
      return 'typescript'
    case ['map', 'json', 'jsonc'].includes(ext):
      return 'jsonc'
    case ['md', 'markdown'].includes(ext):
      return 'markdown'
    case ['html', 'ejs'].includes(ext):
      return 'html'
    case ['scss', 'sass'].includes(ext):
      return 'scss'
    case ['yml', 'yaml'].includes(ext):
      return 'yaml'
    case ['css'].includes(ext):
      return 'css'
    case ['less'].includes(ext):
      return 'less'
    case ['styl'].includes(ext):
      return 'stylus'
    case ['vue'].includes(ext):
      return 'vue'
    case ['py'].includes(ext):
      return 'python'
    case ['go'].includes(ext):
      return 'go'
    case ['java'].includes(ext):
      return 'java'
    case ['c'].includes(ext):
      return 'c'
    case ['cpp'].includes(ext):
      return 'cpp'
    case ['h'].includes(ext):
      return 'h'
    case ['hpp'].includes(ext):
      return 'hpp'
    case ['rb'].includes(ext):
      return 'ruby'
    case ['php'].includes(ext):
      return 'php'
    case ['sh'].includes(ext):
      return 'shell'
    case ['swift'].includes(ext):
      return 'swift'
    case ['rs'].includes(ext):
      return 'rust'
    case ['pug'].includes(ext):
      return 'pug'
    case ['kt'].includes(ext):
      return 'kotlin'
    case ['lua'].includes(ext):
      return 'lua'
    case ['scala'].includes(ext):
      return 'scala'
    case ['toml'].includes(ext):
      return 'toml'
    case ['xml'].includes(ext):
      return 'xml'
    case ['graphql'].includes(ext):
      return 'graphql'
    case ['proto'].includes(ext):
      return 'protobuf'
    case ['mdx'].includes(ext):
      return 'mdx'
    case ['svelte'].includes(ext):
      return 'svelte'
    case ['bat'].includes(ext):
      return 'bat'
    case ['coffeescript'].includes(ext):
      return 'coffeescript'
    case ['json5'].includes(ext):
      return 'json5'
    case ['dart'].includes(ext):
      return 'dart'
    case ['cs'].includes(ext):
      return 'csharp'
    case ['ini'].includes(ext):
      return 'ini'
    case ['sql'].includes(ext):
      return 'sql'
    default:
      return 'plaintext'
  }
}
