Инструкция по WSGI
https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-uswgi-and-nginx-on-ubuntu-18-04-ru

https://stackoverflow.com/questions/53204916/what-is-the-meaning-of-failed-building-wheel-for-x-in-pip-install
pip install wheel

pip install redis
pip install rq

https://khashtamov.com/ru/python-rq-howto/
pip install rq-scheduler

rq worker --url redis://localhost:6380
rqscheduler -H localhost -p 6380 -i 5

rq worker --with-scheduler --url redis://localhost:6379

https://dev.to/sasicodes/flask-and-env-22am
pip install python-dotenv