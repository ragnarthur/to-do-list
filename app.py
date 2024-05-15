from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app

app = create_app()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    due_date = db.Column(db.String(10), nullable=True)
    priority = db.Column(db.String(10), nullable=True)
    status = db.Column(db.String(10), nullable=False, default='Pending')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add_task():
    data = request.get_json()
    task_content = data.get('title')
    if not task_content:
        return jsonify({'error': 'O título da tarefa não pode estar vazio.'}), 400
    if Task.query.filter_by(title=task_content).first():
        return jsonify({'error': 'Tarefa já existe.'}), 400
    new_task = Task(
        title=task_content,
        description=data.get('description'),
        due_date=data.get('due_date'),
        priority=data.get('priority'),
        status='Pending'
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task added!'})

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    task_list = [{'id': task.id, 'title': task.title, 'description': task.description, 'due_date': task.due_date, 'priority': task.priority, 'status': task.status} for task in tasks]
    return jsonify(task_list)

@app.route('/edit/<int:id>', methods=['PUT'])
def edit_task(id):
    data = request.get_json()
    task = Task.query.get_or_404(id)
    new_title = data.get('title')
    if not new_title:
        return jsonify({'error': 'O título da tarefa não pode estar vazio.'}), 400
    if Task.query.filter_by(title=new_title).first():
        return jsonify({'error': 'Tarefa já existe.'}), 400
    task.title = new_title
    task.description = data.get('description')
    task.due_date = data.get('due_date')
    task.priority = data.get('priority')
    task.status = data.get('status')
    db.session.commit()
    return jsonify({'message': 'Task edited!'})

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted!'})

@app.route('/toggle-status/<int:id>', methods=['PUT'])
def toggle_status(id):
    task = Task.query.get_or_404(id)
    task.status = 'Completed' if task.status == 'Pending' else 'Pending'
    db.session.commit()
    return jsonify({'message': 'Task status updated!'})

if __name__ == '__main__':
    app.run(debug=True)
