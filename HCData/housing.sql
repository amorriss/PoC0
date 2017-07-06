CREATE TABLE [dbo].[housing]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [certificate] NVARCHAR(50) NOT NULL, 
    [identification_type] NVARCHAR(50) NOT NULL, 
    [owner] NVARCHAR(50) NOT NULL, 
    [registration_date] DATETIME NOT NULL
)
