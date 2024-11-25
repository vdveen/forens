const { Client } = require("@googlemaps/google-maps-services-js");

exports.handler = async function(event, context) {
    const client = new Client({});
    
    const routes = [
        {
            id: 'route1',
            origin: 'Amersfoort Centraal',
            destination: 'Amsterdam Centraal'
        },
        {
            id: 'route2',
            origin: 'Amersfoort Centraal',
            destination: 'Amsterdam Zuid'
        }
    ];

    try {
        const results = await Promise.all(routes.map(route => 
            client.directions({
                params: {
                    origin: route.origin,
                    destination: route.destination,
                    mode: 'transit',
                    key: process.env.GOOGLE_MAPS_API_KEY,
                    departure_time: 'now'
                }
            })
        ));

        const processedRoutes = results.map((result, index) => ({
            id: routes[index].id,
            duration: Math.round(result.data.routes[0].legs[0].duration.value / 60)
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ routes: processedRoutes })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch transit times' })
        };
    }
};