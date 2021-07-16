# Universum
Universum visualizes real time data collected from various sources through its GraphQL API. It is not only used for visualization, but also for data monitoring in an operations center.

#### Front End
* [Next.js](https://nextjs.org/)
* [SWR real time polling](https://swr.vercel.app/)
* [GraphQL Client](https://graphql.org/)
* [Vis.js](https://visjs.org/)

#### Back End
* [Node.js](https://nodejs.org/en/)
* [GraphQL Server](https://graphql.org/)
* [Apollo](https://www.apollographql.com/)

#### Authentication
* [OpenID Connect Client](https://curity.io/resources/learn/oidc-node-express/)

#### Database
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2019)

#### Data sources
* Proprietary monitoring system X
* Proprietary monitoring system Y
* Proprietary monitoring system Z
* Active Directory

  
![Universum](https://github.com/Ermilin/Universum/blob/main/universum.png)

## Database Data Dictionary
### Department

Contains department names. Next layer is the **Group** table.
| Column          	| Data type    	| Nullability 	| Description                     	| 
|-----------------	|--------------	|-------------	|---------------------------------	|
| DepartmentID    	| Int          	| Not null    	| Primary key for Department rows 	| 
| DepartmentLabel 	| nvarchar(50) 	| Not null    	| Name of the department          	|

Example
| DepartmentID 	| DepartmentLabel 	|
|--------------	|-----------------	|
| 1            	| Medical Imaging 	|

### Group
Contains group names. Next layer is the **System** table.
| Column     	| Data type    	| Nullability 	| Description                            	|
|------------	|--------------	|-------------	|----------------------------------------	|
| GroupID    	| Int          	| Not null    	| Primary key for group rows             	|
| GroupLabel 	| nvarchar(50) 	| Not null    	| Name of the group                      	|
| DeptID     	| Int          	| Not null    	| Foreign key to Department.DepartmentID 	|

Example
| GroupID 	| GroupLabel  	| DeptID 	|
|---------	|-------------	|--------	|
| 3       	| Ultra Sound 	| 1      	|

### System
Contains system names. Next layer is the **Host** table.
| Column      	| Data type    	| Nullability 	| Description                  	|
|-------------	|--------------	|-------------	|------------------------------	|
| SystemID    	| Int          	| Not null    	| Primary key for system rows  	|
| SystemLabel 	| nvarchar(50) 	| Not null    	| Name of the system           	|
| GroupID     	| Int          	| Not null    	| Foreign key to Group.GroupID 	|

Example
| SystemID 	| SystemLabel          	| GroupID 	|
|----------	|----------------------	|---------	|
| 5        	| Ultra Sound software 	| 3       	|

### Host
Contains hostname and description of a host.
| Column          	| Data type     	| Nullability 	| Description                    	|
|-----------------	|---------------	|-------------	|--------------------------------	|
| HostID          	| Int           	| Not null    	| Primary key for host rows      	|
| HostLabel       	| nvarchar(50)  	| Not null    	| Name of the host               	|
| HostDescription 	| nvarchar(256) 	| Null        	| Description of the host        	|
| SystemID        	| Int           	| Not null    	| Foreign key to System.SystemID 	|

Example:
| HostID 	| HostLabel          	| HostDescription               	| SystemID 	|
|--------	|--------------------	|-------------------------------	|----------	|
| 42     	| ultrasoundhostname 	| Production application server 	| 5        	|


### Software
Contains software information such as its name and version
| Column          	| Data type     	| Nullability 	| Description                   	|
|-----------------	|---------------	|-------------	|-------------------------------	|
| SoftwareID      	| Int           	| Not null    	| Primary key for software rows 	|
| SoftwareLabel   	| nvarchar(256) 	| Not null    	| Name of the software          	|
| SoftwareVersion 	| nvarchar(50)  	| Null        	| Version of the software       	|
| HostID          	| Int           	| Not null    	| Foreign key to Host.HostID    	|

Example
| SoftwareID 	| SoftwareLabel        	| SoftwareVersion 	| HostID 	|
|------------	|----------------------	|-----------------	|--------	|
| 1          	| Ultra Sound Software 	| 1.42.1337       	| 5      	|

### Status
Contains current status of monitored services
| Column        	| Data type     	| Nullability 	| Description                       	|
|---------------	|---------------	|-------------	|-----------------------------------	|
| TimeStamp     	| datetime      	| Not null    	| Time of the last update           	|
| StatusLabel   	| nvarchar(50)  	| Not null    	| Status label                      	|
| ServiceLabel  	| nvarchar(254) 	| Not null    	| Label of what is being monitored  	|
| ServiceStatus 	| nvarchar(254) 	| Null        	| Status of what is being monitored 	|
| HostID        	| Int           	| Not null    	| Foreign key to Host.HostID        	|

Example
| HostID 	| StatusLabel 	| ServiceLabel 	| ServiceStatus 	| TimeStamp           	|
|--------	|-------------	|--------------	|---------------	|---------------------	|
| 42     	| Warning     	| Filesystem C 	| Above 70%     	| 2019-12-17 06:00:00 	|
| 42     	| Critical    	| Filesystem D 	| Above 95%     	| 2019-12-17 06:00:00 	|
| 42     	| OK          	| Ping         	| NULL          	| 2019-12-17 06:00:00 	|

### AttributeDefinitions
Contains the attribute labels, the values are stored in the table **Attribute**

| Column         	| Data type     	| Nullability 	| Description                                     	|
|----------------	|---------------	|-------------	|-------------------------------------------------	|
| AttributeID    	| int           	| Not null    	| Primary key for the attribute definitions table 	|
| AttributeLabel 	| nvarchar(256) 	| Not null    	| Label of the attribute                          	|

Example
| AttributeDefID 	| AttributeLabel   	|
|----------------	|------------------	|
| 1              	| Operating System 	|
| 2              	| IP Adress        	|
| 3              	| VLAN             	|
| 4              	| Dependency       	|
| 5              	| Software Label   	|

### Attribute
Contains the attribute values, the labels are stored in the table **AttributeDefinitions**

| Column         	| Data type     	| Nullability 	| Description                                        	|
|----------------	|---------------	|-------------	|----------------------------------------------------	|
| AttributeID    	| int           	| Not null    	| Primary key for the attribute rows                 	|
| HostID         	| int           	| Not null    	| Foreign key to Host.HostID                         	|
| AttributeDefID 	| Int           	| Not null    	| Foreign key to AttributeDefinitions.AttributeDefID 	|
| AttributeValue 	| nvarchar(256) 	| Not null    	| Value of the attribute                             	|

Example
| AttributeID 	| HostID 	| AttributeDefID 	| AttributeValue           	|
|-------------	|--------	|----------------	|--------------------------	|
| 1           	| 42     	| 1              	| Windows Server 2012      	|
| 2           	| 42     	| 2              	| 12.34.567.890            	|
| 3           	| 42     	| 4              	| Java                     	|
| 4           	| 42     	| 3              	| VLAN For Imaging Devices 	|
| 5           	| 42     	| 4              	| .NET 3.12.1              	|

### StatusDictionary

Contains the translation of the status codes coming from the **DataSource** Table
| Column             	| Data type    	| Nullability 	| Description                                	|
|--------------------	|--------------	|-------------	|--------------------------------------------	|
| StatusDictionaryID 	| Int          	| Not null    	| Primary key for the status dictionary rows 	|
| SourceID           	| Int          	| Not null    	| Foreign key to DataSource.SourceID         	|
| StatusCode         	| nvarchar(30) 	| Not null    	| Incoming status code                       	|
| StatusLabel        	| nvarchar(30) 	| Not null    	| Translated status code                     	|

Example
| StatusDictionaryID 	| SourceID 	| StatusCode 	| StatusLabel 	|
|--------------------	|----------	|------------	|-------------	|
| 1                  	| 1        	| 40         	| Warning     	|
| 2                  	| 1        	| 50         	| Critical    	|
| 3                  	| 1        	| 0          	| OK          	|
| 4                  	| 2        	| OK         	| OK          	|

### DataSource 

Contains information of where the data is coming from.
| Column      	| Data type     	| Nullability 	| Description                                    	|
|-------------	|---------------	|-------------	|------------------------------------------------	|
| SourceID    	| int           	| Not null    	| Primary key for the data source rows           	|
| SourceLabel 	| nvarchar(256) 	| Not null    	| Label of the data source                       	|
| SourceUrl   	| nvarchar(256) 	| Null        	| URL of the data source, most likely a REST API 	|

Example
| SourceID 	| SourceLabel                   	| SourceURL                             	|
|----------	|-------------------------------	|---------------------------------------	|
| 1        	| Proprietary Monitoring system 	| https://proprietarymonitoring.com/api 	|
| 2        	| SCOM                          	| https://scom.api                      	|
| 3        	| Active Directory              	| NULL                                  	|



