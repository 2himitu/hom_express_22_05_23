import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
const port = 3000;

// sqlpool;
const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "a9",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//삭제 DELETE 
app.delete("/todos/:id", async (req, res)=>{
  const {id} = req.params;
  const [rows] = await pool.query(
    `select * 
    from todo
    where id= ?
    `,
    [id]
    );
    if(rows.length == 0){
      res.status(404).json({
        msg : "not found",
      });
      return res;
    }
    const [rs] = await pool.query(
      `
      delete
      from todo
      where id = ? 
      `,
      [id]
    );

  res.json({
    msg : `${id}번을 삭제 하였습니다.`  
  });
});


//post 생성
app.post("/todos", async (req, res)=>{
  const [rows] = await pool.query(
    `
    select * 
    from todo 
    order by id 
    desc
    `
  );
  if(rows.length == 0){
    res.status(404).json({
      msg : "not found",
    });
    return res;
  }
  const {perform_date,content} = req.body;
  if(!perform_date){
    res.status(400).json({
      msg :"perform_date required",
    });
    return res;
  }
  if(!content){
    res.status(400).json({
      msg :"content required",
    });
    return res;
  }
  const [rs] = await pool.query(
    `
    insert todo
    set 
    perform_date = ?,
    content = ?
    `,
    [perform_date,content]
  );
  res.json({
    msg : `추가되었습니다.`  
  });
});



//id patch 수정
app.patch("/todos/:id", async (req, res)=>{
  const {id} = req.params;
  const [rows] = await pool.query(
    `select * 
    from todo
    where id= ?
    `,
    [id]
    );
    if(rows.length == 0){
      res.status(404).json({
        msg : "not found",
      });
      return res;
    }
    const {perform_date,content} = req.body;
    if(!perform_date){
      res.status(400).json({
        msg :"perform_date required",
      });
      return res;
    }
    if(!content){
      res.status(400).json({
        msg :"content required",
      });
      return res;
    }
    const [rs] = await pool.query(
      `
      update todo
      set perform_date = ?,
      content = ?
      where id = ? 
      `,
      [perform_date,content,id]
    );

  res.json({
    msg : `${id}번 수정 하였습니다.` 
    
  });
});
//id별 조회
app.get("/todos/:id", async (req, res)=>{
  const {id} = req.params;
  
  const [rows] = await pool.query(
    `
    select *
    from todo 
    where id = ?
    `,
    [id]
    );
  
  if(rows.length == 0){
    res.status(404).json({
      msg: "not found",
    });
    return res;
  }
  res.json(rows[0]);
});
//모두 조회
app.get("/todos", async (req, res)=>{
  const [rows] = await pool.query("select * from todo order by id desc");
  res.json(rows);
});
app.listen(port);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
// app.get("/b.html",function (req, res){
//   res.send("Bye!!")
// });

// // function은 =>로 생략가능 한줄인 경우 {}생략 가능
// app.get("/a.html",(req, res)=>res.send("HI!"));

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
