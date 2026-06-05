/**
 * Interfaces génériques pour la pagination par curseur (Master Performance).
 * Réutilisables dans tous les modules CRUD de l'application.
 */

export interface CursorPaginationQuery {
  /** Nombre d'éléments à récupérer (défaut: 50) */
  take?: number;

  /** ID de l'élément pivot pour la pagination */
  cursor?: string;

  /** Optionnel: filtre de recherche textuelle */
  search?: string;
}

export interface CursorPaginationResult<T> {
  /** Liste des données de la page actuelle */
  data: T[];

  /** Curseur pour la page suivante (undefined si dernière page) */
  nextCursor?: string;

  /** Indique s'il reste des éléments après cette page */
  hasMore: boolean;

  /** Nombre total d'éléments retournés dans cette page */
  count: number;
}
