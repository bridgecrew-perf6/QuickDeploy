// eslint-disable-next-line no-unused-vars
import tree from "element-ui/packages/table/src/store/tree";

export class CloudFormation {

    static vpc = {
        quickVPC: {
            Type: "AWS::EC2::VPC",
            Properties: {
                CidrBlock: "10.0.0.0/16",
                EnableDnsSupport: true,
                EnableDnsHostnames: true,
                Tags: [
                    {
                        Key: "Name",
                        Value: "quickVPC"
                    }
                ]
            }
        }
    }

    static publicSubnet01 = {
        publicSubnet01: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1a",
                VpcId:{
                    Ref: "quickVPC"
                },
                CidrBlock: "10.0.0.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "publicsubnet01"
                    }
                ]
            }
        }
    }

    static publicSubnet02 = {
        publicSubnet02: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1c",
                VpcId:{
                    Ref: "quickVPC"
                },
                CidrBlock: "10.0.2.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "publicsubnet02"
                    }
                ]
            }
        }
    }

    static privateSubnet01 = {
        privateSubnet01: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1a",
                VpcId:{
                    Ref: "quickVPC"
                },
                CidrBlock: "10.0.1.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "privateSubnet01"
                    }
                ]
            }
        }
    }

    static privateSubnet02 = {
        privateSubnet02: {
            Type: "AWS::EC2::Subnet",
            Properties: {
                AvailabilityZone: "ap-northeast-1c",
                VpcId:{
                    Ref: "quickVPC"
                },
                CidrBlock: "10.0.3.0/24",
                Tags: [
                    {
                        Key: "Name",
                        Value: "privateSubnet02"
                    }
                ]
            }
        }
    }

    static internetGateway = {
        igw: {
            Type: "AWS::EC2::InternetGateway",
            Properties: {
                Tags: [
                    {
                        Key: "Name",
                        Value: "igw"
                    }
                ]
            }
        }
    }

    static attachGateway = {
        AttachGateway: {
            Type: "AWS::EC2::VPCGatewayAttachment",
            Properties:{
                VpcId: {
                    Ref: "quickVPC"
                },
                InternetGatewayId: {
                    Ref: "igw"
                }
            }
        }
    }

    static routepublicsubnet = {
        Routepublicsubnet: {
            Type: "AWS::EC2::RouteTable",
            Properties: {
                VpcId: {
                    Ref: "quickVPC"
                },
                Tags: [
                    {
                        Key: "Name",
                        Value: "rt-publicsubnet"
                    }
                ]
            }

        }
    }

    static routePublic = {
        routePublic: {
            Type: "AWS::EC2::Route",
            Properties: {
                RouteTableId: {
                    Ref: "Routepublicsubnet"
                },
                DestinationCidrBlock: "0.0.0.0/0",
                GatewayId: {
                    Ref: "igw"
                }
            }
        }
    }

    static routeTableAssocPublic01 = {
        routeTableAssocPublic01:{
            Type: "AWS::EC2::SubnetRouteTableAssociation",
            Properties: {
                SubnetId: {
                    Ref: "publicSubnet01"
                },
                RouteTableId: {
                    Ref: "Routepublicsubnet"
                }
            }
        }
    }

    static routeTableAssocPublic02 = {
        routeTableAssocPublic02: {
            Type: "AWS::EC2::SubnetRouteTableAssociation",
            Properties: {
                SubnetId: {
                    Ref: "publicSubnet02"
                },
                RouteTableId: {
                    Ref: "Routepublicsubnet"
                }
            }
        }

    }

    static secEC2GroupPublic = {
        SecEC2GroupPublic: {
            Type: "AWS::EC2::SecurityGroup",
            Properties: {
                GroupName: "GroupEC2Name-SG",
                GroupDescription: "SecEC2GroupPublic",
                VpcId: {
                    Ref: "quickVPC"
                },
                SecurityGroupIngress: [
                    {
                        IpProtocol: "tcp",
                        FromPort: 0,
                        ToPort: 65535,
                        CidrIp: "0.0.0.0/0"
                    },
                    {
                        IpProtocol: "tcp",
                        FromPort: 22,
                        ToPort: 22,
                        CidrIp: "0.0.0.0/0"
                    }
                ]
            }
        }
    }



    static secDBGroupPublic = {
        SecGroupPublic: {
            Type: "AWS::EC2::SecurityGroup",
            Properties: {
                GroupName: "GroupName-SG",
                GroupDescription: "SecGroupPublic",
                VpcId: {
                    Ref: "quickVPC"
                },
                SecurityGroupIngress: [
                    {
                        IpProtocol: "tcp",
                        FromPort: 3306,
                        ToPort: 3306,
                        CidrIp: "0.0.0.0/0"
                    },
                    {
                        IpProtocol: "tcp",
                        FromPort: 5432,
                        ToPort: 5432,
                        CidrIp: "0.0.0.0/0"
                    },{
                        IpProtocol: "tcp",
                        FromPort: 1433,
                        ToPort: 1433,
                        CidrIp: "0.0.0.0/0"
                    },{
                        IpProtocol: "tcp",
                        FromPort: 1521,
                        ToPort: 1521,
                        CidrIp: "0.0.0.0/0"
                    },
                    {
                        IpProtocol: "tcp",
                        FromPort: 80,
                        ToPort: 80,
                        CidrIp: "0.0.0.0/0"
                    },
                    {
                        IpProtocol: "tcp",
                        FromPort: 22,
                        ToPort: 22,
                        CidrIp: "0.0.0.0/0"
                    }
                ]
            }
        }
    }

    static publicEC2Instance = {
        publicEC2Instance: {
            Type: "AWS::EC2::Instance",
            Properties: {
                KeyName: "my-key-pair",
                DisableApiTermination: false,
                ImageId: "ami-09ebacdc178ae23b7",
                InstanceType: "t2.micro",
                Monitoring: false,
                UserData:{
                    "Fn::Base64": {
                        "Fn::Join": [
                            "",

                        ]


                    }

                },
                NetworkInterfaces: [
                    {
                        AssociatePublicIpAddress: "true",
                        DeviceIndex: "0",
                        SubnetId: {
                            Ref: "publicSubnet01"
                        },
                        GroupSet: [
                            {
                                Ref: "SecEC2GroupPublic"
                            }
                        ]
                    }
                ],
                Tags: [
                    {
                        Key: "Name",
                        Value: "publicEC2Instance"
                    }
                ]
            }
        }
    }


    static dbInstance = {
        DBInstance: {
            Type: 'AWS::RDS::DBInstance',
            DeletionPolicy: 'Snapshot',
            Properties: {
                AllocatedStorage: '5',
                DBInstanceClass: 'db.t2.micro',
                DBSubnetGroupName: {
                    Ref: 'DBSubnetGroup'
                },
                PubliclyAccessible: true,
                Engine: 'postgres',
                DBName: 'quick',
                MasterUsername: 'qiuckdeploy',
                MasterUserPassword: 'qiuckdeploy',
                StorageType: 'gp2',
                VPCSecurityGroups: [
                    {
                        Ref: "SecGroupPublic"
                    }
                ],
            }
        }
    }

    static dbServerInstance = {
        DBInstance: {
            Type: 'AWS::RDS::DBInstance',
            DeletionPolicy: 'Snapshot',
            Properties: {
                AllocatedStorage: '5',
                DBInstanceClass: 'db.t2.micro',
                DBSubnetGroupName: {
                    Ref: 'DBSubnetGroup'
                },
                Engine: 'MySQL',
                DBName: 'quick',
                MasterUsername: 'quickdeploy',
                MasterUserPassword: 'quickdeploy',
                StorageType: 'gp2',
                VPCSecurityGroups: [
                    {
                        Ref: "SecGroupPublic"
                    }
                ],
            }
        }
    }


    static dbSubnetGroup = {
        DBSubnetGroup: {
            Type: "AWS::RDS::DBSubnetGroup",
            Properties: {
                DBSubnetGroupDescription: "custom subnet group",
                SubnetIds: [
                    { Ref: "publicSubnet01" },
                    { Ref: "publicSubnet02" }
                ]
            }
        }
    }

    static dbParameterGroup = {
        DBParameterGroup: {
            Type: "AWS::RDS::DBParameterGroup",
            Properties: {
                Description: "custom paramter group",
                Family: "MySQL5.6",
                Parameters: {
                    character_set_database: "utf8mb4",
                    character_set_client: "utf8mb4",
                    character_set_connection: "utf8mb4",
                    character_set_results: "utf8mb4",
                    character_set_server: "utf8mb4"
                }
            }
        }
    }

    static amplifyApp = {
        AmplifyApp: {
            Type: "AWS::Amplify::App",
            Properties: {
                Description: "テスト",
                Name: "My-Trello",
                Repository: "https://github.com/KazukiKimura-Developer/my-trello",
                OauthToken: process.env.VUE_APP_GIT_TOKEN,
                AutoBranchCreationConfig: {
                    EnableAutoBranchCreation : true,
                    EnableAutoBuild: true
                },
                Tags: [

                    {
                        Key: "branch",
                        Value: "main"
                    }
                ]
            }
        }
    }

    static amplifyBranch = {
        AmplifyBranch: {
            Type: "AWS::Amplify::Branch",
            Properties: {
                BranchName: "main",
                AppId: {
                    "Fn::GetAtt": ["AmplifyApp", "AppId"]
                },
                Description: "main branch",
                EnableAutoBuild: true
            }
        },
    }


    static outputAmplifyValue = {
        DefaultDomain:{
            Value: {
                "Fn::GetAtt":["AmplifyApp", "DefaultDomain"]
            }
        },

        AppId: {
            Value: {
                "Fn::GetAtt":["AmplifyApp", "AppId"]
            }
        }
    }


    static getAmplifyYamlFormat(appName, repository, branchName){

        this.amplifyApp.AmplifyApp.Properties.Name = appName
        this.amplifyApp.AmplifyApp.Properties.Repository = repository
        this.amplifyApp.AmplifyApp.Properties.Tags[0].Value = branchName
        this.amplifyBranch.AmplifyBranch.Properties.BranchName = branchName


        return{
            Resources: {
                ...this.amplifyApp,
                ...this.amplifyBranch
            },
            Outputs: {
                ...this.outputAmplifyValue
            }
        }

    }








    static getRdsYamlFormat(engine, dbName,dbUserName, dbUserPassword){

        this.dbInstance.DBInstance.Properties.Engine = engine
        this.dbInstance.DBInstance.Properties.DBName = dbName
        this.dbInstance.DBInstance.Properties.MasterUsername = dbUserName
        this.dbInstance.DBInstance.Properties.MasterUserPassword = dbUserPassword


        return {
            Resources: {
                ...this.vpc,
                ...this.publicSubnet01,
                ...this.publicSubnet02,
                ...this.internetGateway,
                ...this.attachGateway,
                ...this.routepublicsubnet,
                ...this.routePublic,
                ...this.routeTableAssocPublic01,
                ...this.routeTableAssocPublic02,
                ...this.secDBGroupPublic,
                ...this.dbSubnetGroup,
                ...this.dbInstance

            }
        }
    }

    static geEC2YamlFormat(formAlign, springCommand){

        this.dbServerInstance.DBInstance.Properties.DBName = formAlign.dbName
        this.dbServerInstance.DBInstance.Properties.Engine = formAlign.engineValue
        this.dbServerInstance.DBInstance.Properties.MasterUsername = formAlign.masterUserName
        this.dbServerInstance.DBInstance.Properties.MasterUserPassword = formAlign.masterUserPassword

        this.publicEC2Instance.publicEC2Instance.Properties.UserData["Fn::Base64"]["Fn::Join"].push(springCommand)

        return  {
            Resources: {
                ...this.vpc,
                ...this.publicSubnet01,
                ...this.publicSubnet02,
                ...this.privateSubnet01,
                ...this.privateSubnet02,
                ...this.internetGateway,
                ...this.attachGateway,
                ...this.routepublicsubnet,
                ...this.routePublic,
                ...this.routeTableAssocPublic01,
                ...this.routeTableAssocPublic02,
                ...this.secEC2GroupPublic,
                ...this.publicEC2Instance,
                ...this.secDBGroupPublic,
                ...this.dbSubnetGroup,
                ...this.dbServerInstance
            }
        }

    }
}