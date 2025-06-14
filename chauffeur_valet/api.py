import frappe
from frappe import _

@frappe.whitelist()
def get_service_area():
    """Get the service areas (cities and zones) for the current valet."""
    try:
        # Get the current user
        current_user = frappe.session.user

        # Get the valet document for the current user
        valet = frappe.get_doc('Valet', {'user': current_user})
        if not valet:
            return {
                'success': False,
                'message': 'Valet not found for current user'
            }

        # Get serviceable cities
        cities = []
        for city in valet.serviceable_cities:
            cities.append(city.city)

        # Get serviceable zones
        zones = []
        for zone in valet.serviceable_zones:
            zones.append(zone.zone)

        return {
            'success': True,
            'data': {
                'cities': cities,
                'zones': zones
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Valet Service Area Error')
        return {
            'success': False,
            'message': str(e)
        } 