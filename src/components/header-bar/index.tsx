import { globalStore } from '@/store'
import { cn } from '@/utils/class-names'
import { useClipboard } from '@shined/react-use'
import useSWR from 'swr'

interface Props {
  files?: string[]
  selected?: string
  onSelect?: (file: string) => void
  loadingTypes?: boolean
}

const repoApi = 'https://ungh.cc/repos/vikiboss/react-online'
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function HeaderBar(props: Props) {
  const { loadingTypes, files = [], selected = '', onSelect = () => {} } = props
  const clipboard = useClipboard()
  const { data } = useSWR(repoApi, fetcher)

  const [useAutoImportMap, useWaterCSS] = globalStore.useSnapshot((s) => [s.useAutoImportMap, s.useWaterCSS])

  return (
    <div className="h-4vh w-full min-h-36px flex justify-between border-0 border-b border-solid border-gray/24">
      <div className="flex items-center">
        {files.map((e) => {
          const isActive = e === selected

          return (
            <div
              key={e}
              onKeyDown={() => onSelect(e)}
              onClick={() => onSelect(e)}
              className={cn(
                'cursor-pointer h-full hover:bg-zinc-6/40 hover:dark:bg-zinc-6/72 flex items-center px-4',
                isActive
                  ? ' dark:bg-zinc-6/80 bg-zinc-6/32 border-0 border-y-2 border-solid border-b-gray border-t-transparent'
                  : 'dark:bg-zinc-6/92 bg-zinc-6/20',
              )}
            >
              {e}
            </div>
          )
        })}
        {loadingTypes && <div className="h-full flex items-center px-4">Loading dts files...</div>}
      </div>
      <div className="flex items-center gap-4 mr-2">
        <div className="flex gap-2 items-center">
          <input
            id="use-water-css"
            type="checkbox"
            checked={useWaterCSS}
            onChange={(event) => {
              globalStore.mutate.useWaterCSS = event.target.checked
            }}
          />
          <label htmlFor="use-water-css">use Water CSS</label>
        </div>
        <div className="flex gap-2 items-center" title="update Import Map automatically">
          <input
            id="use-auto-import-map"
            type="checkbox"
            checked={useAutoImportMap}
            onChange={(event) => {
              globalStore.mutate.useAutoImportMap = event.target.checked
            }}
          />
          <label htmlFor="use-auto-import-map">auto Import Map</label>
        </div>
        <button type="button" onClick={() => clipboard.copy(location.href)}>
          {clipboard.copied ? 'Copied' : 'Copy Sharable URL'}
        </button>
        <a href="https://github.com/vikiboss/react-online">
          Star on GitHub ({Number(data?.repo?.stars ?? '').toLocaleString()}+)
        </a>
      </div>
    </div>
  )
}
