"""Query Logger Backend Server."""
import httpx
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn

APP = FastAPI(
  title="ARS Query Logger",
  description="ARS Query Logs for the last 24 hours",
  version="0.1.0",
  translator_teams=["SRI"],
  contact={
      "name": "Max Wang",
      "email": "max@covar.com",
      "x-id": "maxwang",
      "x-role": "responsible developer",
  },
)

@APP.get("/api/logs")
async def get_logs(ars_url: str, ara: str):
  """GET the ARS log of all queries in the last 24 hours for a specific ARA."""
  async with httpx.AsyncClient(timeout=60) as client:
    url = ars_url + "/" + ara
    response = await client.get(
      url=url,
    )
    return response.json()


@APP.get("/api/aras")
async def get_aras():
  """Get list of aras by infores."""
  inforeses = []
  try:
    async with httpx.AsyncClient(timeout=10) as client:
      response = await client.get('https://smart-api.info/api/query?q=info.x-translator.component:ARA&fields=info.x-translator.infores')
      response = response.json()
      inforeses = [hit['info']['x-translator']['infores'].split(":")[1] for hit in response['hits'] if 'info' in hit]
  except Exception as e:
    print(e)
  # return only unique inforeses
  return list(set(inforeses))

# servers UI
APP.mount("/", StaticFiles(directory="ui/build", html=True), name="ui")

if __name__ == "__main__":
  uvicorn.run("server:APP", port=9734, reload=True)
