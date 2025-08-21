'use client';

import Sample, { metadata } from './sample.mdx';

export default function SamplePage() {
  console.log(metadata);
  return (
    // <main className="mx-auto flex grow justify-center">
    <div className="mx-auto md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:justify-end md:gap-15">
      <div className="max-md:hidden"></div>
      <article className="mx-auto prose prose-xl py-12 prose-invert">
        <Sample />
      </article>
      <nav className="sticky top-16 hidden max-h-[calc(100dvh_-_--spacing(24))] w-xs shrink-0 rounded-2xl xl:block xl:overflow-y-auto">
        <ol className="prose-a:text-muted-foreground prose-a:hover:text-foreground prose prose-neutral dark:prose-invert prose-a:block prose-a:leading-snug prose-a:no-underline prose-a:hover:decoration-sky-500 sm:prose-a:text-sm prose-ol:my-2 prose-ol:list-none prose-ol:pl-6 prose-li:my-2 prose-li:px-0">
          <li>
            <a href="#what-we-build">What we build</a>
          </li>
          <li>
            <a href="#the-final-code">The final code</a>
          </li>
          <li>
            <a href="#why-shiki">Why Shiki?</a>
          </li>
          <li>
            <a href="#project-setup">Project setup</a>
            <ol>
              <li>
                <a href="#install-shiki">Install Shiki</a>
              </li>
            </ol>
          </li>
          <li>
            <a href="#create-the-code-component">Create the code component</a>
            <ol>
              <li>
                <a href="#integrate-shiki">Integrate Shiki</a>
              </li>
              <li>
                <a href="#display-component">Display component</a>
              </li>
              <li>
                <a href="#make-component-reusable">Make component reusable</a>
              </li>
            </ol>
          </li>
          <li>
            <a href="#enhancing-the-component">Enhancing the component</a>
            <ol>
              <li>
                <a href="#highlighting-specific-lines">
                  Highlighting Specific Lines
                </a>
              </li>
              <li>
                <a href="#showing-code-changes">Showing Code Changes</a>
              </li>
              <li>
                <a href="#including-filenames">Including Filenames</a>
              </li>
            </ol>
          </li>
          <li>
            <a href="#customizing-appearance">Customizing appearance</a>
            <ol>
              <li>
                <a href="#integrate-line-numbers">Integrate Line Numbers</a>
              </li>
              <li>
                <a href="#styling-highlights-and-diffs">
                  Styling Highlights and Diffs
                </a>
              </li>
              <li>
                <a href="#final-touch">Final Touch</a>
              </li>
            </ol>
          </li>
          <li>
            <a href="#bonus-copy-to-clipboard-functionality">
              Bonus: Copy to clipboard functionality
            </a>
          </li>
        </ol>
      </nav>
    </div>
    // </main>
  );
}
