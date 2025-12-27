# Frontend Refactoring - Mudanças Pendentes

## ✅ Concluído:
1. Tipos TypeScript atualizados em `src/types/strapi.ts`
2. Função `getHomepageSettings()` atualizada com `populate: 'deep'`
3. Fetch de `homepageSettings` adicionado em `page.tsx`
4. About Section refatorada
5. Metrics Section refatorada
6. Projects Section refatorada
7. Team Section refatorada

## 🔄 Pendente (Alumni Section):

Substituir:
```tsx
      {/* Alumni Preview */}
      <section className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                {'/// egressos'}
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">Alumni</h3>
              <p className="text-ufam-secondary mt-2 max-w-xl">
                Nossos egressos atuam em universidades, indústrias e centros de pesquisa ao redor do
                mundo.
              </p>
            </div>
```

Por:
```tsx
      {/* Alumni Preview */}
      {homepageSettings?.sectionVisibility?.showAlumni !== false && (
        <section className="py-24 bg-ufam-dark border-t border-white/5 relative z-10">
          <div className="container mx-auto px-6">
            <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
                  {homepageSettings?.alumniSection?.label || '/// egressos'}
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-white font-tech">
                  {homepageSettings?.alumniSection?.title || 'Alumni'}
                </h3>
                {homepageSettings?.alumniSection?.description && (
                  <p className="text-ufam-secondary mt-2 max-w-xl">
                    {homepageSettings.alumniSection.description}
                  </p>
                )}
              </div>
```

E fechar a seção com `)}` após `</section>`

## 🔄 Pendente (Partners Section):

Substituir:
```tsx
          <FadeIn className="text-center mb-12">
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
              {'/// parceiros'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white font-tech mb-4">
              Rede de Colaboração Internacional
            </h3>
            <p className="text-ufam-secondary max-w-2xl mx-auto">
              Colaboramos com universidades e centros de pesquisa de excelência ao redor do mundo.
            </p>
          </FadeIn>
```

Por:
```tsx
          <FadeIn className="text-center mb-12">
            <h2 className="font-tech text-ufam-primary text-sm mb-2 tracking-widest lowercase">
              {homepageSettings?.partnersSection?.label || '/// parceiros'}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white font-tech mb-4">
              {homepageSettings?.partnersSection?.title || 'Rede de Colaboração Internacional'}
            </h3>
            {homepageSettings?.partnersSection?.description && (
              <p className="text-ufam-secondary max-w-2xl mx-auto">
                {homepageSettings.partnersSection.description}
              </p>
            )}
          </FadeIn>
```

E envolver toda a seção com `{homepageSettings?.sectionVisibility?.showPartners !== false && (` no início e `)}` no final.

## 🔄 Pendente (Publications Section):

Similar aos anteriores, envolver com controle de visibilidade e substituir:
- label: `{homepageSettings?.publicationsSection?.label || '/// publicações'}`
- title: `{homepageSettings?.publicationsSection?.title || 'Produção Científica'}`
- description: condicional

## 🔄 Pendente (News Section):

Similar aos anteriores, envolver com controle de visibilidade e substituir:
- label: `{homepageSettings?.newsSection?.label || '/// notícias'}`
- title: `{homepageSettings?.newsSection?.title || 'Últimas Atualizações'}`
- description: condicional (pode estar vazio)

## 📝 Notas:
- Todas as seções devem verificar `sectionVisibility` antes de renderizar
- Sempre fornecer fallbacks para garantir que o site funcione mesmo sem dados do Strapi
- O campo `description` deve ser renderizado condicionalmente apenas se existir
