/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

async function loadGoogleFont() {
  const url =
    'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap';
  const css = await (await fetch(url)).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);

    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get('title') || 'oazevedo.dev';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#0c0a0a',
          padding: '60px',
          color: '#fff',
          border: '10px solid #fff',
        }}
      >
        <h1
          style={{
            fontSize: 80,
            color: '#fff',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          <img
            src="https://avatars.githubusercontent.com/u/15058771?v=4"
            width="120"
            height="120"
            alt="Github user profile pic"
            style={{
              borderRadius: '50%',
              marginRight: '20px',
              border: '3px solid #fff',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 30,
                color: '#fff',
              }}
            >
              Adriano de Azevedo
            </div>
            <div
              style={{
                fontSize: 25,
                color: '#fff',
              }}
            >
              https://oazevedo.dev
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Open Sans',
          data: await loadGoogleFont(),
        },
      ],
    },
  );
}
