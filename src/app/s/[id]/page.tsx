import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import TextContentHighlight from './TextContentHighlight';

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
    <>
      <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">LinkBin</h1>
              </div>
              <div className="flex items-center">
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Create your own
              </Link>
              </div>
            </div>
          </div>
      </nav>
      
      
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {content.type === 'text' && (
            <div className="p-1">
              <TextContentHighlight code={content.data} />
            </div>
          )}
          
          {content.type === 'image' && (
            <div className="p-6 flex justify-center">
              <Image
                src={content.imageUrl}
                alt="Shared content"
                width={600}
                height={600}
                style={{ maxWidth: '100%', height: 'auto' }}
                unoptimized
              />
            </div>
          )}
        </div>
        
        {content.createdAt && (
          <p className="text-gray-500 text-xs mt-4">
            Created: {new Date(content.createdAt).toLocaleString()}
          </p>
        )}
      </div>
    </>
  );
}