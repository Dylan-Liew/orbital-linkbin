import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';

async function getContent(id: string) {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/s/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }

    const contentType = res.headers.get('content-type');
    if (contentType?.startsWith('image/')) {
      return { type: 'image', imageUrl: `/api/s/${id}` };
    }

    return await res.json();
  } catch {
    return null;
  }
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getContent(id);
  
  if (!content) {
    notFound();
  }
  
  if (content.type === 'link') {
    redirect(content.data);
  }
  
  return (
    <div>
      {content.type === 'text' && (
        <div>
          <pre>
            {content.data}
          </pre>
        </div>
      )}
      
      {content.type === 'image' && (
        <div>
          <Image
            src={content.imageUrl}
            alt="Shared content"
            width={800}
            height={600}
            style={{ maxWidth: '100%', height: 'auto' }}
            unoptimized
          />
        </div>
      )}
      
      {content.createdAt && (
        <p style={{ color: '#666', fontSize: '12px', marginTop: '20px' }}>
          Created: {new Date(content.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
