import { client } from '@/sanity/lib/client';
import { ResearchClient, ResearchPaper } from './ResearchClient';

interface ResearchProps {
  displayLimit?: number;
  showTitle?: boolean;
  paddingTop?: string;
  reverse?: boolean;
}

export async function Research({ displayLimit, showTitle = true, paddingTop, reverse }: ResearchProps) {
  const papers: ResearchPaper[] = await client.fetch(`*[_type == "research"]|order(year desc){
    title,
    url,
    doi,
    authors,
    year,
    venue,
    abstract,
    longDescription,
    bulletPoints,
    keywords
  }`);

  return (
    <ResearchClient 
      papers={papers} 
      displayLimit={displayLimit} 
      showTitle={showTitle} 
      paddingTop={paddingTop} 
      reverse={reverse} 
    />
  );
}
