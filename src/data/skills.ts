export type SkillCategoryId = 'data' | 'ai' | 'web' | 'tools';

export const skills: Record<SkillCategoryId, string[]> = {
  data: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Power BI', 'SQL'],
  ai: [
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'RAG',
    'LLM',
    'PyTorch',
    'TensorFlow',
    'Scikit-learn',
  ],
  web: ['React', 'JavaScript', 'Django', 'FastAPI', 'HTML', 'CSS'],
  tools: ['PostgreSQL', 'MySQL', 'Git', 'GitHub', 'Docker'],
};

export const skillOrder: SkillCategoryId[] = ['data', 'ai', 'web', 'tools'];
