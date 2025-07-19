import './index.css';

export default function TextRenderer({
  content,
  truncate,
}: {
  content: string;
  truncate?: boolean;
}) {
  if (!content) {
    return null;
  }
  return (
    <section
      className='text-renderer'
      style={
        truncate
          ? {
              display: '-webkit-box',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflowWrap: 'break-word',
              overflow: 'hidden',
            }
          : {}
      }
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    ></section>
  );
}
