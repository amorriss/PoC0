CREATE TABLE [dbo].[properties]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [certificate] NVARCHAR(50) NOT NULL, 
    [identification] NVARCHAR(50) NOT NULL, 
    [owner] NVARCHAR(50) NOT NULL, 
    [registration_date] DATETIME NOT NULL
)
