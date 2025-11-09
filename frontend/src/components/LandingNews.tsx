import React from 'react';

type Props = {
  headline?: string;
  items?: string[];
};

const LandingNews: React.FC<Props> = ({ headline = 'Neuigkeiten', items = [] }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">{headline}</h2>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-gray-500">Keine Neuigkeiten</li>
        ) : (
          items.map((it, i) => (
            <li key={i} className="text-sm text-gray-700">• {it}</li>
          ))
        )}
      </ul>
    </section>
  );
};

export default LandingNews;
