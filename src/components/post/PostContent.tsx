"use client";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="
          prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
          prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
          prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
          prose-p:text-base prose-p:leading-7 prose-p:mb-4
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:font-semibold prose-strong:text-foreground
          prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
          prose-li:mb-2
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
          prose-img:rounded-lg prose-img:shadow-md
          prose-table:w-full prose-table:border-collapse
          prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2
          prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
        "
      />
    </article>
  );
}
