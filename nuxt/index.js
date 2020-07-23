import path from 'path'

export default function NuxtMandeModule() {
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'mande.js',
  })
}
