create extension if not exists vector with schema extensions;

create table if not exists kb_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text default 'manual',
  source_id text,
  content text not null,
  metadata jsonb default '{}',
  embedding extensions.vector(768),
  created_at timestamptz default now()
);

create index if not exists kb_documents_embedding_hnsw_idx
on kb_documents
using hnsw (embedding extensions.vector_cosine_ops);

create or replace function match_kb_documents (
  query_embedding extensions.vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    kb_documents.id,
    kb_documents.title,
    kb_documents.content,
    kb_documents.metadata,
    1 - (kb_documents.embedding <=> query_embedding) as similarity
  from kb_documents
  where 1 - (kb_documents.embedding <=> query_embedding) > match_threshold
  order by kb_documents.embedding <=> query_embedding
  limit match_count;
$$;
