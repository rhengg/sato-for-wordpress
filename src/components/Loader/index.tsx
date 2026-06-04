import './loader.css'

type LoaderProps = {
  width?: string
  height?: string
  borderColor?: string
  borderBottom?: string
}

const Index = (props: LoaderProps) => {
  const { width, height, borderColor, borderBottom } = props
  return (
    <span className="loader"
      style={{
        border: '2px solid',
        borderColor: borderColor || "#FFFFFF",
        borderBottomColor: borderBottom || "transparent",
        width: width || '16px',
        height: height || '16px',
      }}
    ></span>
  )
}

export default Index