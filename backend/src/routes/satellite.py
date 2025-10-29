from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import datetime
import requests
import json
from src.models.satellite import Satellite, db

satellite_bp = Blueprint("satellite", __name__)

# Données TLE par défaut pour quelques satellites populaires
DEFAULT_SATELLITES = [
    {
        "name": "ISS (ZARYA)",
        "norad_id": 25544,
        "line1": "1 25544U 98067A   25258.58667824  .00000862  00000-0  23985-4 0  9991",
        "line2": "2 25544  51.6444 177.8408 0007929  67.2999  15.7149 15.50246502358837",
        "category": "Space Stations",
    },
]

@satellite_bp.route("/satellites", methods=["GET"])
@cross_origin()
def get_satellites():
    """Récupérer la liste des satellites disponibles (uniquement l'ISS pour l'instant)"""
    try:
        satellites = Satellite.query.filter_by(is_active=True).all()

        if not satellites:
            for sat_data in DEFAULT_SATELLITES:
                satellite = Satellite(
                    name=sat_data["name"],
                    norad_id=sat_data["norad_id"],
                    line1=sat_data["line1"],
                    line2=sat_data["line2"],
                    category=sat_data["category"],
                )
                db.session.add(satellite)
            db.session.commit()
            satellites = Satellite.query.filter_by(is_active=True).all()

        return jsonify(
            {"success": True, "satellites": [sat.to_dict() for sat in satellites]}
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@satellite_bp.route("/iss/position", methods=["GET"])
@cross_origin()
def get_iss_position():
    """Récupérer la position actuelle de l'ISS via l'API Open Notify"""
    try:
        response = requests.get("http://api.open-notify.org/iss-now.json")
        response.raise_for_status()  # Lève une exception pour les codes d'état HTTP d'erreur
        data = response.json()

        if data["message"] == "success":
            latitude = float(data["iss_position"]["latitude"])
            longitude = float(data["iss_position"]["longitude"])
            timestamp = datetime.datetime.fromtimestamp(data["timestamp"]).isoformat()

            # Pour l'ISS, nous n'avons pas d'azimut/élévation/distance direct via cette API
            # Nous allons simuler ces valeurs ou les laisser nulles pour l'instant.
            # Le frontend devra s'adapter à cela.
            return jsonify({
                "success": True,
                "satellite": {
                    "name": "ISS (ZARYA)",
                    "norad_id": 25544
                },
                "position": {
                    "latitude": round(latitude, 2),
                    "longitude": round(longitude, 2),
                    "azimuth": None, # Non disponible via cette API
                    "elevation": None, # Non disponible via cette API
                    "range_km": None, # Non disponible via cette API
                    "visible": None, # Non disponible via cette API
                    "timestamp": timestamp
                }
            })
        else:
            return jsonify({"success": False, "error": "Erreur de l'API Open Notify"}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "error": f"Erreur de connexion à l'API Open Notify: {e}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@satellite_bp.route("/satellites/<int:satellite_id>/passes", methods=["POST"])
@cross_origin()
def get_satellite_passes(satellite_id):
    """Les passages ne sont pas disponibles via l'API Open Notify pour l'ISS"""
    return jsonify({"success": False, "error": "Les passages ne sont pas disponibles pour l'ISS via cette API temporaire."}), 400

@satellite_bp.route("/satellites/search", methods=["GET"])
@cross_origin()
def search_satellites():
    """Rechercher des satellites par nom (uniquement l'ISS pour l'instant)"""
    try:
        query = request.args.get("q", "").strip()
        if not query:
            return jsonify({"success": False, "error": "Paramètre de recherche requis"}), 400

        satellites = (
            Satellite.query.filter(
                Satellite.name.ilike(f"%{query}%"), Satellite.is_active == True
            )
            .limit(20)
            .all()
        )

        return jsonify(
            {"success": True, "query": query, "satellites": [sat.to_dict() for sat in satellites]}
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@satellite_bp.route("/satellites/update-tle", methods=["POST"])
@cross_origin()
def update_tle_data():
    """Mettre à jour les données TLE (non implémenté avec l'API temporaire)"""
    return jsonify(
        {"success": True, "message": "Fonctionnalité de mise à jour TLE à implémenter (non disponible avec l'API temporaire)"}
    )


