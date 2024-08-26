import dynamic from 'next/dynamic'

const OutputWindow = dynamic(() => import('./OutputWindow'), { ssr: false })

export default OutputWindow