#################################################################################
#************************************************************************************************#
# Script: nosql_demo                                                                             #
# Usage : Script to serve NoSQL GSE demo: nosql simulator, main html                             #
#d Date                                  Who                           What                       #
#------------------------------------------------------------------------------------------------#
# 29-Mar-2016                        LUISARIA.MX                  Initial Version                #
#------------------------------------------------------------------------------------------------#
#************************************************************************************************#
import time, logging, sys, uuid, json, random, os, socket, subprocess, calendar, requests, ast
from datetime import date 
from threading import Thread
from multiprocessing.pool import ThreadPool
from multiprocessing import Pool
from functools import partial
#from nosqldb import ConnectionException, Factory, StoreConfig
from bottle import route, run, request, static_file, response

global params, rows_inserted, init_time, ellapsed_time, rows_per_second, port, max_rows, current_rows_inserted, current_start_time, current_rows_per_second, current_ellapsed_time, current_init_time, current_max_rows, last_run, running, system_memory, system_cpus, date_today, current_max_rows

root_path = os.path.dirname(os.path.realpath(__file__))

def read_json(file):
	with open( file ) as data_file: 
		return json.load(data_file)	
		
random_coords = read_json( root_path + "/../catalogs/random_coords.json" )
random_skus = read_json( root_path + "/../catalogs/random_skus.json" )
database_props = read_json( root_path + "/../catalogs/database_props.json" )
store_host_port = database_props["store_host_port"]
proxy_host_port = database_props["proxy_host_port"]


def aggregate(store, building):
	aggregate_set = {}
	for x in range( 1, 30 ):
		set = store.multi_get("buildings", {"day" : str(x), "month" : "4", "year" : "2016", "building" : building}, False)	
		for row in set:
			#print "Day: %s, Light: %s, Temperature: %s" % ( row["day"], row["light"], row["temperature"] )
			try:			
				aggregate_set[int(row["day"])]["light"] = ( aggregate_set[int(row["day"])]["light"] + int(row["light"]) ) / 2		 			#average light	
				aggregate_set[int(row["day"])]["temperature"] = ( aggregate_set[int(row["day"])]["temperature"] + int(row["temperature"]) ) / 2	#average temperature		
			except KeyError:
				aggregate_set[int(row["day"])] = {"light":0, "temperature":0}
				aggregate_set[int(row["day"])]["light"] = int(row["light"])
				aggregate_set[int(row["day"])]["temperature"] = int(row["temperature"])
	return aggregate_set

def retrieve(building):
	global params
	print "Getting stats for building %s" % building
	date_today = date.today()
	#store = open_store()

	#pool = ThreadPool(processes=1)
	#async_result = pool.apply_async(aggregate, (store, building)) # thread the reading so reading functions dont stop
	#TFL: Kafka Modification to Read from Kafka
	# CREATE THE CONSUMER GROUP
	url="https://"+params["eventhubIP"]+":"+params["eventhubport"]+"/restproxy/consumers/groupName"
	payload='{"name": "my_instanceID", "format": "json", "auto.offset.reset": "smallest"}'

	headers = {"Content-Type": "application/vnd.kafka.json.v1+json"}
	res = requests.post(url, auth=(params["user"],params["password"]), data=payload, headers=headers, verify=False)
	print("Output from the GROUP: ", res)
	# READ FROM THE TOPIC
	url     = "https://"+params["eventhubIP"]+":"+params["eventhubport"]+"/restproxy/consumers/groupName/instances/my_instanceID/topics/"+params["identitydomain"]+"-"+params["topic"]
	headers = {"Accept": "application/vnd.kafka.json.v1+json"}
	res = requests.get(url, auth=(params["user"],params["password"]), headers=headers, verify=False)
	print(res)
	target=open("raw.json",'w')
	target.truncate()
	target.write(res.text)
	target.close()
	chart_format = []
	chart_format.append( [ "Day", "Light", "Temperature" ] )

	index=0
	with open('raw.json', 'r') as f:
		data = json.loads(f.read())

		for value in data:
			index=index+1
			value_j=eval(str(value))
			print ("Deleting OE.. ", value_j['value']['temperature'])
			building=value_j['value']['building']
			chart_format.append( [ str(index),  int(value_j['value']["light"]), int(value_j['value']["temperature"]) ] )
			print chart_format
	return {"title" : building, "data" : chart_format}



def insert_random_row( table_name, building_name, floor_number, temperature_min, temperature_max, light_min, light_max):
	random_coord_index = random.randint(0, len(random_coords) - 1)
	row = {
		"uuid" : 			str( uuid.uuid4() ),
		"lat" : 			str( random_coords[ random.randint(0, random_coord_index) ][0] ),
		"lon" : 			str( random_coords[ random.randint(0, random_coord_index) ][1] ),
		"temperature" : 	str( random.randint( temperature_min, temperature_max ) ),
		"timestamp" : 		str( time.time() ),
		"day" : 			str( random.randint( 1, 30 ) ),
		"month" : 			str( date_today.month ),
		"year" : 			str( date_today.year ),
		"sku" : 			str( random_skus[ random.randint(0, len(random_skus) - 1)] ),
		"building" : 		building_name,
		"floor" : 			str( floor_number ),
		"sensor_location" : str( random.randint(0, 50) ),
		"light" : 			str( random.randint( light_min, light_max ) )
	}
	row_i=str(row)
	row_i=row_i.replace("'",'"')
	#print ("ROW: ", row_i)

	#TFL:store.put(table_name, row)
	#Command added /TFL
	bash_com = "curl -i -k -X POST -u  '"+params["user"]+":"+params["password"]+"' -H 'Content-Type: application/vnd.kafka.json.v1+json' --data '{\"records\": [{\"value\":#ROW#}]}' https://"+params["eventhubIP"]+":"+params["eventhubport"]+"/restproxy/topics/"+params["identitydomain"]+"-"+params["topic"]
	bash_com=bash_com.replace("#ROW#",row_i)
	#    print("the command", bash_com)
	#print("******************* EXECUTING THE CODE")
	url     = "https://"+params["eventhubIP"]+":"+params["eventhubport"]+"/restproxy/topics/"+params["identitydomain"]+"-"+params["topic"]
	payload = '{"records": [{"value":#ROW#}]}'
	payload = payload.replace("#ROW#",row_i)
	#print("###################PAYLOAD: ",payload)
	headers = {"Content-Type": "application/vnd.kafka.json.v1+json"}
	res = requests.post(url, auth=(params["user"],params["password"]), data=payload, headers=headers, verify=False)
	#subprocess.Popen(bash_com)
	#output = subprocess.check_output(['bash','-c', bash_com]) 
	print("Output: ", res)
	#print("Finish the code")

def start_threads(thread_qty, building_name, floor_number, temperature_min, temperature_max, light_min, light_max):
	global current_rows_inserted, current_start_time, current_rows_per_second, current_ellapsed_time, current_max_rows, current_init_time, last_run, running
	current_rows_per_second = current_rows_inserted = current_start_time = current_ellapsed_time = 0
	current_init_time = time.time()
	last_run = last_run + 1
	threads = []
	try:
		for i in range(thread_qty):
			threads.append(Thread(target = thread_action, args=(building_name, floor_number, temperature_min, temperature_max, light_min, light_max,0) ))
		for thread in threads:
			thread.start()
		
		return "Starting bulk of " + str(current_max_rows) + " using " + str(thread_qty) + " connections"
	except Exception, e:		
		print e
		return "Error: unable to start thread"
		

def start_processes(thread_qty, building_name):
	global current_rows_inserted, current_start_time, current_rows_per_second, current_ellapsed_time, current_max_rows, current_init_time, last_run, running
	current_rows_per_second = current_rows_inserted = current_start_time = current_ellapsed_time = 0
	current_init_time = time.time()
	last_run = last_run + 1
	pool = Pool(5)
	try:
		pool.map(partial(thread_action, building_name, floor_number, temperature_min, temperature_max, light_min, light_max), range(thread_qty))
		
		return "Starting bulk of " + str(current_max_rows) + " using " + str(thread_qty) + " threads"
	except Exception, e:		
		print e
		return "Error: unable to start thread"
	
	
# Define a function for the thread
def thread_action( building_name, floor_number, temperature_min, temperature_max, light_min, light_max, na ):
	global current_rows_inserted, rows_inserted, max_rows, last_run, running
	#store = open_store()
	this_run = last_run
	running = 1
	
	print "Starting from thread"
	while rows_inserted < max_rows:
		insert_random_row("buildings", building_name, floor_number, temperature_min, temperature_max, light_min, light_max)
		current_rows_inserted = current_rows_inserted + 1
		rows_inserted = rows_inserted + 1
		update_today_ellapsed_time()		
		if rows_inserted % 200 == 0:			
			print get_globals()
	if this_run == last_run: running = 0
	store.close()

def create_table(table_def):
    store = open_store()
    table_stmt = open(table_def).read()
    print "Table Statement: %s" % ( table_stmt ) 
    store.execute_sync(table_stmt)
    store.close() 

# configure and open the store
def open_store():
	try:
		kvstoreconfig = StoreConfig('kvstore', [store_host_port])
		return Factory.open(proxy_host_port, kvstoreconfig)
	except ConnectionException, ce:
		logging.error("Store connection failed.")
		logging.error(ce.message)
		sys.exit(-1)

def save_object(table_name, object, store=False):	
	store = open_store()
	try:
		store.put(table_name, object)
		logging.debug("Store write succeeded.")
	except Exception, iae:
		logging.error("Could not write table.")
		logging.error(iae.message)

	store.close() 
 
def get_memory(Mem):
	return float(filter (None, subprocess.check_output( "cat /proc/meminfo | grep " + Mem + ":" , shell=True ).split(" "))[1])	
	
def get_cpus():
	return float( subprocess.check_output( "nproc" , shell=True ) )	
 
def select(table, query):
	store = open_store()
	try:
		rows = store.table_iterator(table, query, False)
		for r in rows:
			print r
	except Exception, iae:
		logging.error("Could not get rows.")
		logging.error(iae.message)
	store.close() 
 
def update_today_ellapsed_time():
   global params, rows_inserted, init_time, ellapsed_time, rows_per_second, current_rows_inserted, current_start_time, current_rows_per_second, current_ellapsed_time, current_init_time
   
   ellapsed_time = time.time() - init_time
   rows_per_second = rows_inserted / ellapsed_time

   current_ellapsed_time = time.time() - current_init_time
   current_rows_per_second = current_rows_inserted / current_ellapsed_time

def get_globals():
	global free_memory
	free_memory = get_memory("MemFree")
	return { "rows_inserted" : rows_inserted, "init_time" : init_time, "rows_per_second" : rows_per_second, "ellapsed_time" : ellapsed_time, "current_rows_inserted" : current_rows_inserted, "current_init_time" : current_init_time, "current_rows_per_second" : current_rows_per_second, "current_ellapsed_time" : current_ellapsed_time, "max_rows" : max_rows, "current_max_rows" : current_max_rows, "running" : running ,  "system_memory" : system_memory,  "system_cpus" : system_cpus,  "free_memory" : free_memory }
   
def init_globals(argparams):
	global params, rows_inserted, init_time, ellapsed_time, rows_per_second, max_rows, port, current_rows_inserted, current_start_time, current_rows_per_second, current_ellapsed_time, current_init_time, current_max_rows, last_run, running, system_memory, system_cpus, date_today
	rows_inserted = ellapsed_time = rows_per_second = max_rows = current_rows_inserted = current_start_time = current_rows_per_second = current_ellapsed_time = last_run = running = 0
	current_init_time = time.time()
	init_time = time.time()
	system_memory = get_memory("MemTotal")
	free_memory = get_memory("MemFree")
	system_cpus = get_cpus()
	date_today = date.today()
	params = {
		"eventhubIP":argparams[1],
		"eventhubport":argparams[2],
		"identitydomain":argparams[3],
		"topic":argparams[4],
		"user":argparams[5],
		"password":argparams[6]
	}
	port = 8100
		
@route('/refresh_environment', method='POST')
def refresh_environment():
	refresh_exit_code = subprocess.call( root_path + "/../bin/clean_demo > " + root_path + "/../logs/clean.log", shell=True )
	if refresh_exit_code == 0:
		message = "Environment was clean successfully"
	else :
		message = "Refresh failed, please check log file"
	return json.dumps( { "message" : message } )
	   
@route('/start_load', method='POST')
def start_load():
	response.set_header('Access-Control-Allow-Origin', '*')
	global max_rows, current_max_rows
	#######client parameters
	building_name = request.forms.get('building_name')
	current_max_rows = int( request.forms.get('max_rows') )
	threads = int( request.forms.get('threads') )
	floor_number = request.forms.get('floor_number')	
	temperature_min = int(request.forms.get('temperature_min'))
	temperature_max = int(request.forms.get('temperature_max'))
	light_min = int(request.forms.get('light_min'))
	light_max = int(request.forms.get('light_max'))
	###############################################################
	max_rows = max_rows + current_max_rows #increase global max row scope
	return json.dumps( start_threads( threads, building_name, floor_number, temperature_min, temperature_max, light_min, light_max ) )
	
@route('/<filename:path>')
def send_static(filename):
    root_location = root_path + "/../html/"
    print "serving file: " + root_location + filename
    return static_file(filename, root=root_location)

@route('/retrieve_row', method='POST')
def retrieve_row():
	response.set_header('Access-Control-Allow-Origin', '*')
	
	return json.dumps( retrieve( request.forms.get('building') ) ) 
	
@route('/get_status')
def get_status():
	response.set_header('Access-Control-Allow-Origin', '*')
	
	global params, rows_inserted, init_time, ellapsed_time, rows_per_second, current_rows_inserted, current_start_time, current_rows_per_second, current_ellapsed_time, current_init_time, last_run	
	globals = get_globals()
	print globals
	return json.dumps( globals )
	
def run_server():
	global port
	print "Starting server in port " + str(port)
	run(host='0.0.0.0', port=port)
		
if __name__ == "__main__":				
	if len(sys.argv) > 1 and sys.argv[1] == "debug":
		locals()[sys.argv[2]]()
	else:
		init_globals(sys.argv)	
		run_server()		
