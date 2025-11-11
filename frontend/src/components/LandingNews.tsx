import React, { useEffect, useState } from 'react';

type Props = {
  headline?: string;
  items?: string[];
};

const LandingNews: React.FC<Props> = ({ headline = 'Flux d\'actualités', items = [] }) => {
  const [localItems, setLocalItems] = useState<string[]>(items || []);

  // Si aucune item n'est passée en prop, tenter de récupérer des actualités depuis l'API
  useEffect(() => {
    if (localItems.length > 0) return; // déjà des items

    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) return;
        const data = await res.json();
        // On attend un tableau simple de chaînes ou un objet { items: string[] }
        if (Array.isArray(data)) {
          setLocalItems(data);
        } else if (Array.isArray(data.items)) {
          setLocalItems(data.items);
        }
      } catch (err) {
        // silent fail — on affichera le message "Aucune actualité" plus bas
        // console.debug('LandingNews: fetch failed', err);
      }
    };

    fetchNews();
  }, [localItems]);

  // En dev local, fournir un fallback visible pour faciliter le debug
  // Note: le fallback de développement a été retiré — le composant n'ajoute plus d'items automatiquement

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">{headline}</h2>
      <ul className="space-y-2">
        {localItems.length === 0 ? (
          <li className="text-sm text-gray-500">Aucune actualité</li>
        ) : (
          localItems.map((it, i) => (
            <li key={i} className="text-sm text-gray-700">• {it}</li>
          ))
        )}
      </ul>
    </section>
  );
};

export default LandingNews;
