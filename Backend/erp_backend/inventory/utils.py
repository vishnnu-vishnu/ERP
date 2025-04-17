import redis
import json
from django.conf import settings

redis_client = redis.Redis(host=settings.REDIS_HOST, port=6379, db=0)

def get_cached(key):
    print("from cache")
    value = redis_client.get(key)
    if value:
        return json.loads(value)
    return None

def set_cache(key, data, expiry=300): 
    print("to cache")
    redis_client.set(key, json.dumps(data), ex=expiry)


def invalidate_cache(key):
    try:
        deleted = redis_client.delete(key)
        if deleted:
            print(f"Cache key '{key}' invalidated.")
        else:
            print(f"Cache key '{key}' not found.")
    except Exception as e:
        print(f"Error while invalidating cache '{key}': {e}")
