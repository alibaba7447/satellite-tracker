# Satellite Tracker - Suivi de Satellites en Temps Réel

Ce projet est une application web pour le suivi de satellites en temps réel. Il est composé d'un backend en Flask et d'un frontend en React.

## Fonctionnalités

- Suivi de la position de l'ISS en temps réel via l'API Open Notify.
- Interface utilisateur moderne et réactive construite avec React et Tailwind CSS.
- Backend Flask pour servir les données et l'application.
- (Fonctionnalité future) Suivi de plusieurs satellites via l'API N2YO.com.

## Installation

### Prérequis

- Python 3.11+
- Node.js & pnpm

### Backend

1.  Naviguez vers le dossier `backend`.
2.  Créez un environnement virtuel : `python -m venv venv`
3.  Activez l'environnement : `source venv/bin/activate`
4.  Installez les dépendances : `pip install -r requirements.txt`
5.  Lancez le serveur : `python src/main.py`

### Frontend

1.  Naviguez vers le dossier `frontend`.
2.  Installez les dépendances : `pnpm install`
3.  Lancez le serveur de développement : `pnpm run dev`

## Déploiement

Le backend Flask est configuré pour servir les fichiers statiques du frontend après la construction.

1.  Construisez le frontend : `cd frontend && pnpm run build`
2.  Copiez les fichiers construits dans le dossier static du backend : `cp -r dist/* ../backend/src/static/`
3.  Déployez l'application Flask.

## Auteur

Ce projet a été développé par Bachir Bouhend.

