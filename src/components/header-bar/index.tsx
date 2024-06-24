import useSWR from 'swr'
import { useClipboard } from '@shined/react-use'
import { cn } from '@/utils/class-names'

interface Props {
  files?: string[]
  selected?: string
  onSelect?: (file: string) => void
  loading?: boolean
}

const repoApi = 'https://api.github.com/repos/vikiboss/react-online'
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function HeaderBar(props: Props) {
  const { loading, files = [], selected = '', onSelect = () => {} } = props
  const clipboard = useClipboard()
  const { data } = useSWR(repoApi, fetcher)

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
                'cursor-pointer h-full hover:opacity-92 font-mono flex items-center px-4',
                isActive
                  ? ' dark:bg-zinc-6/80 bg-zinc-6/20 border-0 border-y-2 border-solid border-b-gray border-t-transparent'
                  : '',
              )}
            >
              {e}
            </div>
          )
        })}
        {loading && <div className="bg-gray/12 h-full flex items-center px-4">Loading dts files...</div>}
      </div>
      <div className="flex items-center gap-2 mr-2">
        <button type="button" onClick={() => clipboard.copy(location.href)}>
          {clipboard.copied ? 'Copied' : 'Copy Sharable URL'}
        </button>
        <a href="https://github.com/vikiboss/react-online">
          Star on GitHub ({Number(data?.stargazers_count ?? '').toLocaleString()}+)
        </a>
      </div>
    </div>
  )
}
