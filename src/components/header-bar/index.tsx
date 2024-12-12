import useSWR from 'swr'
import { cn } from '@/utils/class-names'
import { store } from '@/store'
import { useClipboard } from '@shined/react-use'

const repoApi = 'https://ungh.cc/repos/vikiboss/react-online'
const fetcher = (url: string) => fetch(url).then(res => res.json())

export function HeaderBar() {
  const [fileTree, activeFile] = store.useSnapshot(s => [s.fileTree, s.activeFile])
  const clipboard = useClipboard()
  const { data } = useSWR(repoApi, fetcher)
  const config = store.useSnapshot(s => s.config)

  return (
    <div className='h-4vh w-full min-h-36px flex justify-between border-0 border-b border-solid border-gray/24'>
      <div className='flex items-center'>
        {Object.entries(fileTree).map(([filename]) => {
          const isActive = filename === activeFile

          return (
            <div
              key={filename}
              onKeyDown={() => {
                store.mutate.activeFile = filename
              }}
              onClick={() => {
                store.mutate.activeFile = filename
              }}
              className={cn(
                'cursor-pointer h-full hover:bg-zinc-6/40 hover:dark:bg-zinc-6/72 flex items-center px-4',
                isActive
                  ? ' dark:bg-zinc-6/80 bg-zinc-6/32 border-0 border-y-2 border-solid border-b-gray border-t-transparent'
                  : 'dark:bg-zinc-6/92 bg-zinc-6/20'
              )}
            >
              {filename}
            </div>
          )
        })}
      </div>
      <div className='flex items-center gap-4 mr-2'>
        <div className='flex gap-2 items-center'>
          <input
            id='use-water-css'
            type='checkbox'
            checked={config.waterCSS}
            onChange={event => {
              store.mutate.config.waterCSS = event.target.checked
            }}
          />
          <label htmlFor='use-water-css'>use Water CSS</label>
        </div>
        {/* <div className='flex gap-2 items-center' title='update Import Map automatically'>
          <input
            id='use-auto-import-map'
            type='checkbox'
            checked={config.autoImportMap}
            onChange={event => {
              store.mutate.config.autoImportMap = event.target.checked
            }}
          />
          <label htmlFor='use-auto-import-map'>auto Import Map</label>
        </div> */}
        <button type='button' onClick={() => clipboard.copy(location.href)}>
          {clipboard.copied ? 'Copied' : 'Copy Sharable URL'}
        </button>
        <a href='https://github.com/vikiboss/react-online'>
          Star on GitHub ({Number(data?.repo?.stars ?? '').toLocaleString()}+)
        </a>
      </div>
    </div>
  )
}
