SECRET_KEY='no_secret'
FLASK_DEBUG=True
HOSTNAME = '127.0.0.1'
PORT = '3306'
DATABASE = 'spr_database'
USERNAME = 'root'
PASSWORD = '54273'
DB_URI='mysql+pymysql://{}：{}@{}:{}?charset=utf8'.format(USERNAME,PASSWORD,HOSTNAME,PORT)
SQLALCHEMY_DATABASE_URI = DB_URI



