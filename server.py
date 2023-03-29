"""Query Logger Backend Server."""
import httpx
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn

APP = FastAPI(
  title="ARS Query Logger",
  description="ARS Query Logs for the last 24 hours",
  version="1.0.0",
  translator_teams=["SRI"],
  contact={
      "name": "Max Wang",
      "email": "max@covar.com",
      "x-id": "maxwang",
      "x-role": "responsible developer",
  },
)


@APP.get("/api/ars")
async def get_ars_urls():
  """GET list of ARS urls for each environment."""
  ars_urls = []
  try:
    async with httpx.AsyncClient(timeout=10) as client:
      response = await client.get("https://smart-api.info/api/query?q=4c12efd48ced755ac4b72b1922202ec2")
      response = response.json()
      for hit in response["hits"]:
        for server in hit["servers"]:
          ars_urls.append(server)
  except Exception as e:
    print(e)
  return ars_urls


@APP.get("/api/logs")
async def get_logs(ars_url: str, ara: str):
  """GET the ARS log of all queries in the last 24 hours for a specific ARA."""
  async with httpx.AsyncClient(timeout=60) as client:
    url = f"{ars_url}/ars/api/reports/{ara}"
    response = await client.get(
      url=url,
    )
    return response.json()


@APP.get("/api/actors")
async def get_aras(ars_url: str):
  """
  Get list of aras by ars actor.
  
  Example actor:
  {
    "model": "tr_ars.actor",
    "pk": 1,
    "fields": {
      "name": "ara-aragorn-runquery",
      "channel": [
        "general",
        "workflow"
      ],
      "agent": "ara-aragorn",
      "urlRemote": "https://aragorn.renci.org/aragorn/asyncquery",
      "path": "http://ars-dev.transltr.io/ara-aragorn/api/runquery",
      "active": true
    }
  }
  """
  actors = []
  try:
    async with httpx.AsyncClient(timeout=10) as client:
      response = await client.get(f"{ars_url}/ars/api/actors")
      response = response.json()
      for actor in response:
        # loop through all actors and send back all active ones
        if actor["fields"]["active"]:
          actors.append(actor["fields"]["agent"].split("-", 1)[1])
  except Exception as e:
    print(e)
  # return only unique inforeses
  return list(set(actors))

# servers UI
APP.mount("/", StaticFiles(directory="ui/build", html=True), name="ui")

if __name__ == "__main__":
  uvicorn.run("server:APP", port=9734, reload=True)
