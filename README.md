# Project Gestion - Cash Management Backend

## Pourquoi ce projet ?
Ce backend a été créé pour gérer la trésorerie d'une caserne de pompiers composée de 3 équipes. 

### Motivations Techniques
Ce projet a été conçu avec une volonté forte d'améliorer l'expérience de développement et la qualité des interfaces de documentation et de test, en remplaçant des outils traditionnels par des alternatives plus modernes :

1. **Modernisation de la documentation API (Scalar)** : Souhaitant dépasser les limitations ergonomiques et visuelles de Swagger, j'ai opté pour **[Scalar](https://scalar.com/)**. Cet outil permet de générer une documentation d'API beaucoup plus épurée, fluide et intuitive.
2. **Amélioration de l'environnement de test (Vitest & UI)** : Afin de rendre l'écriture et le suivi des tests d'intégration (précédemment réalisés avec Supertest) plus interactifs, l'adoption de **[Vitest](https://vitest.dev/)** couplé à `@vitest/ui` offre un confort de travail quotidien largement supérieur grâce à son interface de suivi en temps réel.

## Stack Technique
- **TypeScript** / **Node.js** (Express)
- **Prisma ORM** (PostgreSQL)
- **Zod** pour la validation des données et l'OpenAPI (`@asteasolutions/zod-to-openapi`)
- **Scalar** pour l'UI de la documentation
- **Vitest** pour la suite de tests

## Fonctionnalités (Domaine métier)
- Gestion d'**Équipes** (3 équipes, protégées par code PIN)
- Gestion de **Comptes** (rattachés à une équipe)
- Gestion de **Transactions** (Dépôt, Retrait, Définition de solde) avec traçabilité complète.
