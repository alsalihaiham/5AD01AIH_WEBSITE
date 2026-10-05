import {guard, fail, runtime} from '@/lib/server';
import {parseStats, type Answer} from '@/lib/cf-stats';

const QUERY = `query($zone:String!,$since:Date!,$until:Date!){viewer{zones(filter:{zoneTag:$zone}){httpRequests1dGroups(limit:14,orderBy:[date_ASC],filter:{date_geq:$since,date_leq:$until}){dimensions{date} sum{requests pageViews} uniq{uniques}}}}}`;

// Visitor numbers for the whole domain, read from the Cloudflare GraphQL Analytics API.
export async function GET() {
  try {
    await guard();
    const {CF_API_TOKEN: token, CF_ZONE_ID: zone} = runtime();
    if (!token || !zone) return Response.json({configured: false});
    const day = (offset: number) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
    const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST', headers: {authorization: 'Bearer ' + token, 'content-type': 'application/json'},
      body: JSON.stringify({query: QUERY, variables: {zone, since: day(13), until: day(0)}}),
    });
    if (!response.ok) return Response.json({configured: true, error: 'Cloudflare gaf geen antwoord (' + response.status + '). Controleer de API-sleutel.'});
    const data = await response.json() as Answer;
    return Response.json({configured: true, ...parseStats(data)}, {headers: {'cache-control': 'private, max-age=300'}});
  } catch (e) {
    return fail(e);
  }
}
