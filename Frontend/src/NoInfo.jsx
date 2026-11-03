import { Info } from 'lucide-react'
import { NO_INFO } from '../data.js'

export default function NoInfo({ title }) {
  return (
    <div className="noinfo" role="status">
      <Info size={26} />
      <div>
        {title && <h3>{title}</h3>}
        <p>{NO_INFO}</p>
      </div>
    </div>
  )
}
