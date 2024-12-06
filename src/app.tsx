import { Editor } from './components/editor'
import { HeaderBar } from './components/header-bar'
import { PreviewZone } from './components/preview-zone'

export function App() {
  return (
    <div className='size-screen flex flex-col font-sans'>
      <HeaderBar />
      <div className='flex h-full border-0 border-r border-solid border-gray/32'>
        <Editor />
        <PreviewZone />
      </div>
    </div>
  )
}
