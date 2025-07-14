# Metrics

The cron module exposes several metrics for monitoring and observability:

#### Execution Metrics

**cron\_schedules\_executed\_total**

* **Type**: Counter
* **Description**: Total number of cron schedules executed
* **Labels**:
  * `execution_stage` (begin\_blocker, end\_blocker)
  * `status` (success, failure)

**cron\_messages\_executed\_total**

* **Type**: Counter
* **Description**: Total number of cron messages executed
* **Labels**:
  * `execution_stage` (begin\_blocker, end\_blocker)
  * `status` (success, failure)
  * `contract_address`

**cron\_execution\_duration\_seconds**

* **Type**: Histogram
* **Description**: Duration of cron schedule execution in seconds
* **Labels**:
  * `execution_stage` (begin\_blocker, end\_blocker)
  * `schedule_name`
