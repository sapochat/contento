import PostCreator from "@/components/PostCreator";

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 600, 
            color: '#191919',
            marginBottom: '12px',
            letterSpacing: '-0.02em'
          }}>
            Contento
          </h1>
          <p style={{ 
            fontSize: '16px',
            color: '#666666',
            lineHeight: '1.5'
          }}>
            Your AI guide to creating policy-safe LinkedIn content. Get real-time feedback to ensure your posts 
            align with community guidelines and professional standards.
          </p>
        </div>
        <PostCreator />
      </div>
    </main>
  );
}
